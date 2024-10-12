// Description of an individual auction
// RI: addGuest undefined if not connected to molly and james
// guestOf is a record if its not from molly or james
export type Guest = {
    readonly name: string,
    readonly guestOf: {from:"Molly"|"James"|undefined},
    readonly family: boolean,
    readonly dietary: string,  // ms since epoch
    readonly addGuest: string,
    readonly gGdiet:string,
    //undefined if not bringing someone
    //RI: can only be 0 or 1
    readonly bringingSomeone: 'unknown'|'1'|'0'
  };