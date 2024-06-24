const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    profilePic: {
      type: String,   /* include profile pictures or placeholders  - (user upload his own image)*/
      default: "https://imgur.com/gallery/i9xknax",
    },
    campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
    donations: [{ type: Schema.Types.ObjectId, ref: "Donations" }],
   
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt` <<<--- ????
    timestamps: true,
  }
);

userSchema.virtual('totalDonation', {
  ref: 'Donations', // Modelo referenciado
  localField: '_id', // Campo local no modelo User
  foreignField: 'user', // Campo na doação que se refere ao usuário
  justOne: false, // Se é um ou mais registros
  /* options: { 
      match: { status: 'completed' } // Filtra as doações com status 'completed'
  }, */
  // Define uma função para calcular o valor total de doações
  get: function() {
    console.log('this.donations:', this.donations);
    if (!this.donations) {
        return 0;
    }
    const total = this.donations.reduce((acc, donation) => acc + donation.amount, 0);
    console.log('Total donation amount:', total);
    return total;
}
});

const User = model("User", userSchema);

module.exports = User;

