import {getMultihash} from './multiHash'
export const formatSpacesResponse = (spaces) => spaces[0].map((s,idx) => (
  {
    id: s,
    feeIdx:spaces[1][idx],
    infoIdx: spaces[2][idx]
  }
))

export const formatMultiHashesResponse = (hashes) => (
  hashes[0]
  .map((s,idx) => [s, hashes[1][idx], hashes[2][idx]])
  .map(getMultihash)
)
