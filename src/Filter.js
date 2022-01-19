const Filter = ({text, set, cur}) => {

  return (
    <li onClick={() => set(text)}
        style={{textDecoration: text === cur && 'underline'}}>
      {text}
    </li>
  )
}

export default Filter
