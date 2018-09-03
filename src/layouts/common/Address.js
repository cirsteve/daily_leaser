import React from 'react'

export default ({address, chars}) => <div title={address}>{address.slice(0,chars+2)+'...'+address.slice(42-chars)}</div>
