import gsap from 'gsap';
import {loadImages} from '~/utils/loadImage';
import { onMount, onCleanup } from 'solid-js';
import SplitType from 'split-type';
import { initScrollTrigger } from '~/components/core/scrollTrigger';
import { cvUnit, inView, lerp } from '~/utils/number';

const vertex = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4( a_position, 0, 1 );
    }
`
const fragment = `
    precision mediump float;

    uniform vec4 resolution;
    uniform vec2 mouse;
    uniform vec2 threshold;
    uniform float pixelRatio;
    uniform sampler2D image0;
    uniform sampler2D image1;

    vec2 mirrored(vec2 v) {
        vec2 m = mod(v, 2.0);
        return mix(m, 2.0 - m, step(1.0, m));
    }

    void main() {
        // Calculate UV coordinates and apply pixel ratio
        vec2 uv = gl_FragCoord.xy * pixelRatio / resolution.xy;
        vec2 vUv = (uv - vec2(0.5, 1.0)) * resolution.zw + vec2(0.5, 1.0);
        vUv.y = 1.0 - vUv.y;

        // Sample the depth map
        vec4 tex1 = texture2D(image1, mirrored(vUv));
        // Apply the fake 3D effect using depth map and mouse position
        vec2 fake3d = vUv + (tex1.r - 0.5) * mouse / threshold;

        // Sample the final texture using the modified UV coordinates
        gl_FragColor = texture2D(image0, mirrored(fake3d));
    }
`;
class Sketch {
    constructor(canvas) {
        this.canvas = canvas;

        this.gl = this.canvas.getContext('webgl');
        this.ratio = window.devicePixelRatio;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;

        this.strength = { value: 0 }
        this.mouseTargetX = 0;
        this.mouseTargetY = 0;

        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.imageOriginal = this.canvas.getAttribute('data-imageOriginal');
        this.imageDepth = this.canvas.getAttribute('data-imageDepth');
        this.vth = this.canvas.getAttribute('data-verticalThreshold');
        this.hth = this.canvas.getAttribute('data-horizontalThreshold');

        this.imageURLs = [this.imageOriginal, this.imageDepth];
        this.textures = [];

        this.startTime = performance.now();

        this.isFirstRender = true;

        this.addTexture();
        this.createScene();
        this.mouseMove();
    }

    addShader( source, type ) {
        let shader = this.gl.createShader( type );
        this.gl.shaderSource( shader, source );
        this.gl.compileShader( shader );
        let isCompiled = this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS );
        if ( !isCompiled ) {
            throw new Error( 'Shader compile error: ' + this.gl.getShaderInfoLog( shader ) );
        }
        this.gl.attachShader( this.program, shader );
    }

    resizeHandler() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        this.canvas.width = this.width*this.ratio;
        this.canvas.height = this.height*this.ratio;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        let a1,a2;
        if(this.height/this.width<this.imageAspect) {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        } else{
            a1 = (this.width/this.height) * this.imageAspect;
            a2 = 1;
        }

        this.uResolution.set( this.width, this.height, a1, a2 );
        this.uRatio.set( 1/this.ratio );
        this.uThreshold.set( this.hth, this.vth );
        this.gl.viewport( 0, 0, this.width*this.ratio, this.height*this.ratio );
    }

    resize() {
        this.resizeHandler();
        window.addEventListener( 'resize', this.resizeHandler);
    }

    createScene() {
        this.program = this.gl.createProgram();

        this.addShader( vertex, this.gl.VERTEX_SHADER );
        this.addShader( fragment, this.gl.FRAGMENT_SHADER );

        this.gl.linkProgram( this.program );
        this.gl.useProgram( this.program );

        this.uResolution = new Uniform( 'resolution', '4f' , this.program, this.gl );
        this.uMouse = new Uniform( 'mouse', '2f' , this.program, this.gl );
        this.uTime = new Uniform( 'time', '1f' , this.program, this.gl );
        this.uRatio = new Uniform( 'pixelRatio', '1f' , this.program, this.gl );
        this.uThreshold = new Uniform( 'threshold', '2f' , this.program, this.gl );
        // create position attrib
        this.billboard = new Rect( this.gl );
        this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');

        this.gl.enableVertexAttribArray( this.positionLocation );
        this.gl.vertexAttribPointer( this.positionLocation, 2, this.gl.FLOAT, false, 0, 0 );
    }

    addTexture() {
        if (this.textures.length === 0) { // Only load textures if they haven't been loaded
            this.start.bind(this.images);
            loadImages(this.imageURLs, this.start.bind(this));
        } else {
            this.start(this.images); // Start immediately if textures are already loaded
        }
    }

    start(images) {
        let that = this;
        let gl = that.gl;

        this.imageAspect = images[0].naturalHeight/images[0].naturalWidth;
        for (var i = 0; i < images.length; i++) {
            let texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
            this.textures.push(texture);
        }

        // lookup the sampler locations.
        let u_image0Location = this.gl.getUniformLocation(this.program, 'image0');
        let u_image1Location = this.gl.getUniformLocation(this.program, 'image1');

      // set which texture units to render with.
        this.gl.uniform1i(u_image0Location, 0); // texture unit 0
        this.gl.uniform1i(u_image1Location, 1); // texture unit 1

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[1]);

        // start application
        this.resizeHandler = this.debounce(this.resizeHandler.bind(this), 100);
        this.resize();
        this.render();
    }

    mouseMove() {
        document.addEventListener('mousemove', (e) => {
            this.mouseMoveEvent = e;
            if (!this.isMouseMoving) {
                this.isMouseMoving = true;
                requestAnimationFrame(this.processMouseMove.bind(this));
            }
        });
    }

    processMouseMove() {
        const e = this.mouseMoveEvent;
        const halfX = this.windowWidth / 2;
        const halfY = this.windowHeight / 2;
        this.mouseTargetX = (halfX - e.clientX) / halfX;
        this.mouseTargetY = (halfY - e.clientY) / halfY;
        this.isMouseMoving = false;
    }

    render() {
        if (window.innerWidth > 991 && document.querySelectorAll('[data-namespace="home"]').length > 0) {
            if (document.querySelector('.loader-wrap').classList.contains('on-done')) {
                if (this.strength.value <= .99) {
                    let oldStrength = this.strength.value
                    this.strength.value = lerp(oldStrength, 1, .06);
                }

                let currentTime = (performance.now() - this.startTime) / 1000;
                this.uTime.set(currentTime);

                const epsilon = 0.001;

                let newMouseX = (this.mouseX + (this.mouseTargetX - this.mouseX) * 0.03) * this.strength.value;
                let newMouseY = (this.mouseY + (this.mouseTargetY - this.mouseY) * 0.03) * this.strength.value;

                // Check for mouse change with epsilon
                if (Math.abs(newMouseX - this.mouseX) > epsilon || Math.abs(newMouseY - this.mouseY) > epsilon) {
                    this.mouseX = newMouseX;
                    this.mouseY = newMouseY;
                    this.uMouse.set(this.mouseX, this.mouseY);
                    gsap.set('.home__hero-bg-main-inner-bg img, .home__hero-clone-bg-under img', { xPercent: this.mouseX * 1.25, yPercent: this.mouseY * .625 });
                }

                if (inView(this.canvas)) {
                    if (this.isFirstRender) {
                        // gsap.to(this.strength, {value: 1, duration: 10})
                        gsap.to('.home__hero-bg-main-inner.canvas', {
                            autoAlpha: 1, duration: 0, ease: 'none', delay: .5, onComplete() {
                                document.querySelector('.home__hero-bg-main-inner.placeholder').style.display = 'none';
                        } });
                        this.isFirstRender = false;
                    }
                    this.billboard.render(this.gl);
                }
            }
        }
        requestAnimationFrame( this.render.bind(this) );
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        document.removeEventListener('mousemove', this.mouseMoveEvent);
        cancelAnimationFrame(this.render);
    }
}

class Uniform {
    constructor( name, suffix, program, gl ) {
        this.name = name;
        this.suffix = suffix;
        this.gl = gl;
        this.program = program;
        this.location = gl.getUniformLocation( program, name );
        this.currentValue = null;
    }

}

function Rect( gl ) {
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, Rect.verts, gl.STATIC_DRAW );
}

const Background2D = (props) => {
    let scriptRef;

    let sketch;
    onMount(() => {
        if (!scriptRef) return;

        if (window.innerWidth <= 991) return;

        document.querySelector('.home__hero-bg-main-inner.canvas').width = document.querySelector('.home__hero-bg-main-inner.canvas').offsetWidth;
        document.querySelector('.home__hero-bg-main-inner.canvas').height = document.querySelector('.home__hero-bg-main-inner.canvas').offsetHeight;

        let isInitCanvas = false;

        function initCanvas() {
            if (isInitCanvas) return;
            Uniform.prototype.set = function( ...values ) {
                if (this.currentValue && this.areValuesEqual(values, this.currentValue)) {
                    return; // If the new values are the same as the current ones, do nothing
                }
                this.currentValue = values; // Update the current value
                let method = 'uniform' + this.suffix;
                let args = [ this.location ].concat( values );
                this.gl[ method ].apply( this.gl, args );
            };

            Uniform.prototype.areValuesEqual = function(newValues, oldValues) {
                if (!oldValues) return false;
                if (newValues.length !== oldValues.length) return false;

                for (let i = 0; i < newValues.length; i++) {
                    if (newValues[i] !== oldValues[i]) {
                        return false;
                    }
                }

                return true;
            };

            Rect.verts = new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1,
            ]);

            Rect.prototype.render = function( gl ) {
                gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
            };
            sketch = new Sketch(scriptRef);
            isInitCanvas = true;
        }
        document.addEventListener('mousemove', initCanvas)
        onCleanup(() => {
            document.removeEventListener('mousemove', initCanvas);
            sketch.destroy();
        })
    })
    return (
        <canvas
            id="hero-bg"
            ref={scriptRef}
            class="home__hero-bg-main-inner canvas"
            data-imageOriginal={props.imageOriginal}
            data-imageDepth={props.imageDepth}
            data-verticalThreshold={80}
            data-horizontalThreshold={62}
        />
    )
}

export default Background2D;