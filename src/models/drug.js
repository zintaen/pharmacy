import mongoose, { Schema } from 'mongoose';

const drugSchema = new Schema(
   {
      name: {
         type: Schema.Types.String,
         unique: true,
         required: true,
      },
      price: {
         type: Schema.Types.String,
         required: true,
      },
      description: Schema.Types.String,
   },
   {
      timestamps: true,
   },
);

export default mongoose.model('drug', drugSchema);
