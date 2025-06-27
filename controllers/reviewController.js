import Review from "../models/review.js";

export function createReview(req, res) {
  //check user logged
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }

  req.body.userEmail = req.user.email;
  const review = new Review(req.body);
  review.save().then(()=>{
    res.json({
        message: "Review Saved Successfully"
    });
  }).catch((error)=>{
    res.status(500).json({
        message: "Review not Saved"
    })
  })
}

export async function getReviews(req, res){
    const productId = req.params.productId;
    const reviews = await Review.find({productId: productId});
    if (reviews == null) {
         res.status(404).json({
            message: "Review Not Found",
        });
    return;
    }

    res.json({
        reviews: reviews
    })

}
