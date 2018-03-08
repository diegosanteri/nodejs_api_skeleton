import  mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoosePaginate from 'mongoose-paginate';

/**
* @module  RecipeSchema
* @description Recipe schema
*/
const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 5, max: 50 },
    description: { type: String, required: true, max: 500 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    ranking: { type: mongoose.Schema.Types.ObjectId, ref: 'ranking' },    
    ingredients: [{
        ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'ingredient' },
        quantity: {type: String, required: true},
        unit: {type: String, required: true}
    }],
    steps: [{
        details: {
            type: String,
            required: true
        },
        image: {
            type: String
        }
    }],
    tags: [String],
    createdDate: { type: Date, default: Date() }
});

RecipeSchema.plugin(uniqueValidator);
RecipeSchema.plugin(mongoosePaginate);

const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe