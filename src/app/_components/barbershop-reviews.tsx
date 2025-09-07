"use client";

import { api } from "~/trpc/react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface BarbershopReviewsProps {
  barbershopId: string;
}

export function BarbershopReviews({ barbershopId }: BarbershopReviewsProps) {
  const { data: session } = useSession();
  const { data: reviews, isLoading } = api.review.getByBarbershop.useQuery({
    barbershopId,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviews?.reviews || reviews.reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Avis clients</h2>
        <p className="text-gray-600">Aucun avis pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Avis clients ({reviews.reviews.length})
      </h2>
      
      <div className="space-y-4">
        {reviews.reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                {review.user.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.name || "Utilisateur"}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {review.user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                
                <div>
                  <p className="font-medium text-gray-900">
                    {review.user.name || "Utilisateur anonyme"}
                  </p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            
            {review.comment && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
