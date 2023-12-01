export default function Log({ turnInfo }) {
  return (
    <ol id="log">
      {turnInfo.map((turns) => (
        <li key={`${turns.square.row}${turns.square.col}`}>
          {turns.player} selected {turns.square.row}, {turns.square.col}
        </li>
      ))}
    </ol>
  );
}
