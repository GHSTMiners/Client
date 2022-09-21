const selectStyle = {
    singleValue:(base:any) => ({
      ...base,
      color:'rgba(255,255,255,1)',
      textAlign: 'center',
      paddingLeft: '0rem',
      outline:'none',
    }),
    menuList: (provided:any) => ({
      ...provided,
      backgroundColor: 'rgba(68,68,68,0.9)',
    }),
    control: (base:any) => ({
      ...base,
      outline:'none',
    }),
    option: (base:any,state:any) => ({
      ...base,
      backgroundColor: state.isFocused? 'rgba(168,168,168,0.9)' : 'none',
    })
  }

  export default selectStyle