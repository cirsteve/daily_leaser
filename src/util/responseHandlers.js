export const formatSpacesResponse = (spaces) => spaces[0].map((s,idx) => (
  {
    id: s,
    feeIdx:spaces[1][idx],
    infoIdx: spaces[2][idx]
  }
);
