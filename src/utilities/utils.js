const otpGenerator = (len) => {
  let chars = "0123456789"
  
  let length = chars.length;
  let random = "";
  for(let i = 1; i <= len; i++) {
      let posn = Math.ceil(Math.random() * (length-1))
      random += chars[posn]
  }
  return random 
}

module.exports = {
  otpGenerator
}

/*
    Logic)
    1. we choose the length of the otp 
    2. Randomly generate an index, and choose a number from the numbs array and add it to the otpCode string
    3. We run this logic until the length of the otpCode is equal to the otpLength 
*/

// const otpGenerator = (otpLength) => {
//   const numbs = [0,1,2,3,4,5,6,7,8,9]
//   let otpCode = ''
//   let length = otpCode.length

//     for (length=0; length < otpLength; length++) {
//       let index = Math.round(Math.random()*10)
//       let random = numbs[index]
//       otpCode += random
//     }

//   return otpCode
  
// }

// otpGenerator(6)