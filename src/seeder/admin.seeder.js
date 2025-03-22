const bcrypt = require("bcryptjs")
const UserModel = require("../modules/auth/user.model")

const adminUsers = [
  {
    name: "Top Magar",
    email: "topmagar@gmail.com",
    password: bcrypt.hashSync("top@123", 10),
    phone: 9706388431,
    country: "Nepal",
    gender: "male",
    role: "admin",
    status: "active"
  }
]

const populateAdmin = async() => {
  try {
    const listUsers = []
    
    for(let user of adminUsers) {
      let existingUser = await UserModel.findOne({email: user.email})

      if(!existingUser) {
        let newObj = new UserModel(user)
        listUsers.push(newObj.save())
      }
    }
    
    await Promise.allSettled(listUsers)

  } catch(exception) {
    console.log("Error populating admin: ", exception)
    throw exception
  }
}

 module.exports = populateAdmin