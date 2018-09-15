import React from 'react';
import Loading from 'react-loading'

export default ({type, text, show}) => {
  const icon = type === 'blockchain' ?
  <Loading type='cubes' color="gray" height={'20%'} width={'20%'} /> :
  <Loading type='spin' color="blue" height={'20%'} width={'20%'} />;

  return (
    <div className={show ? '' : 'hidden'}>
      {icon}<br />
      {text}
    </div>
  )
}
