function Icon({ width = '100%', name, ...rest }) {
  return (
    <svg {...rest} width={width} aria-hidden="true">
      <use href={`#ai:local:${name}`} />
    </svg>
  );
}
export default Icon;
