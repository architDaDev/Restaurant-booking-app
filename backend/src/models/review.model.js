import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
  }
}, { timestamps: true });

// Static method to calculate average rating
ReviewSchema.statics.getAverageRating = async function(restaurantId) {
  const obj = await this.aggregate([
    { $match: { restaurantId: restaurantId } },
    { $group: { _id: '$restaurantId', averageRating: { $avg: '$rating' } } }
  ]);

  try {
    if (obj.length > 0) {
      // Dynamically fetching the Restaurant model to avoid circular import issues
      await mongoose.model('Restaurant').findByIdAndUpdate(restaurantId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.restaurantId);
});

export default mongoose.model('Review', ReviewSchema);