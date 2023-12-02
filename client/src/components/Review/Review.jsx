import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, getProductReviews } from '../../redux/actions';
import styles from './Review.module.css';



const Reviews = ({ productId }) => {
  const dispatch = useDispatch();
  const [showReviews, setShowReviews] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  
  const useMortis = () => {
    const productReviews = useSelector((state) => state.productsDetail);
    useEffect(() => {
      if (productId) {
        return () => {
          dispatch(getProductReviews(productId));
        };
      }
    }, [dispatch, productId]);
    return productReviews
  }


  let productReviews = useMortis();

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      console.error('productId is not defined');
      return;
    }

    if (!reviewText || rating === 0) {
      alert('Por favor, completa la reseña y asigna una puntuación antes de enviar.');
      return;
    }

    const reviewData = {
      content: reviewText,
      score: rating.toString(),
      productId: productId,
    };

    dispatch(createReview(reviewData));

    // Aqui envio la reseña y actualizo las reviews
    alert('Reseña enviada con éxito');

    setReviewText('');
    setRating(0);

  };
  
  return (
    <div>
      <h2>Reviews:</h2>
      <div>
        {[1, 2, 3, 4, 5].map((index) => (
             <span
             key={index}
             className={index <= rating ? styles.selectedStar : styles.star}
             onClick={() => setRating(index)}
           >
             ★
           </span>
        ))}
      </div>
      <textarea
        placeholder='Deja un comentario'
        className='reviews-textarea'
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <button  onClick={handleReviewSubmit}>
        Enviar
      </button>
      <button  onClick={() => setShowReviews(!showReviews)}>
        {showReviews ? 'Ocultar Reseñas' : 'Ver Reseñas'}
      </button>
      {showReviews && (
        <div >
          <h4>Reseñas anteriores:</h4>
          <ul>
            {productReviews.Reviews && productReviews.Reviews.length > 0 ? (
              productReviews.Reviews.map((review, index) => (
                <div key={review.id}>
                  <h5>Reseñas para {productReviews.title}</h5>
                    <li key={index}>
                      <p>Descripción 📝: {review.content}</p>
                      <p>Puntuación ⭐: {Array(parseInt(review.score, 10)).fill('⭐').join(' ')}</p>
                    </li>
                </div>
              ))
            ) : (
              <p>No hay reseñas disponibles.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reviews;
