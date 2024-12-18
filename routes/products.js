const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Categories = require('../models/Categories');
const { ObjectId } = require('mongoose').Types;


router.post('/:productId/reviews', async (req, res) => {
    const { productId } = req.params;
    const { rating, comment, user_id } = req.body;

    try {
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ message: 'Produkt hittas ej' });
        }

        const newReview = {
            user_id,
            rating,
            review: comment
        };
        product.ratings.push(newReview);

        const totalRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
        product.averageRating = totalRatings / product.ratings.length;

        await product.save();

        res.status(201).json({ message: 'Recension skapad', product });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { name, category, categoryName, price, ratingSort } = req.query; // Lägger till querys för API url. Se README.txt för tutorial

        const aggregationPipeline = [];
        const matchStage = {};

        // Skapar en averageRating baserad på alla reviews för produkten
        aggregationPipeline.push(
            { 
                $unwind: { 
                    path: "$ratings", 
                    preserveNullAndEmptyArrays: true // Keeps products with no ratings
                } 
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    price: { $first: "$price" },
                    category: { $first: "$category" },
                    images: { $first: "$images" },
                    stock: { $first: "$stock" },
                    categoryDetails: { $first: "$categoryDetails" },
                    ratings: { $push: "$ratings" }, // Reconstruct ratings array
                    averageRating: { 
                        $avg: { $ifNull: ["$ratings.rating", 0] } // Calculate average
                    }
                }
            }
        );

        // Hanterar category query function
        if (category) {
            if (ObjectId.isValid(category)) { //Om vi använder "ObjectId" i queryn
                matchStage.category = ObjectId(category);
            } 
            else {
                    return res.status(404).json({ message: 'Kategori hittas ej' });
            }
        }
        

        // Hanterar name query function
        if (name) {
            matchStage.name = { $regex: name, $options: 'i' }; // Case-insensitive regex sökning för en öppnare sökning av name
        }


        // Hanterar price query function. Ange minPrice-maxPrice (t.ex. 1-500)
        if (price) {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            aggregationPipeline.push({
                $match: {
                    price: {
                        ...(minPrice && { $gte: minPrice }),
                        ...(maxPrice && { $lte: maxPrice })
                    }
                }
            });
        }

        // Om querys har använts i url (...name, category) , lägg till dom i matchStage för att hantera aggregation
        if (Object.keys(matchStage).length) {
            aggregationPipeline.unshift({ $match: matchStage });
        }

        // Kopplar ihop categories _id med products category ObjectId
        aggregationPipeline.push({
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryDetails'
            }
        });

        aggregationPipeline.push({ $unwind: '$categoryDetails' });

        if (categoryName) {
            aggregationPipeline.push({
                $match: {
                    'categoryDetails.name': { $regex: categoryName, $options: 'i' } // Case-insensitive regex
                }
            });
        }

        // Visar output arrayen
        aggregationPipeline.push({
            $project: {
                name: 1,
                description: 1,
                price: {
                    $toString: "$price" 
                },
                category: '$category', 
                categoryName: '$categoryDetails.name',
                stock: 1,
                images: 1,
                averageRating: { 
                    $round: ["$averageRating", 1] 
                },
                ratings: 1
            }
        });

        // Hanterar ratingSort query. desc=descending, asc=ascending. sorterar på averageRating
        if (ratingSort) {
            const sortOrder = ratingSort === 'desc' ? -1 : 1; 
            aggregationPipeline.push({
                $sort: { averageRating: sortOrder }
            });
        }

        // Execute aggregation!
        const results = await Product.aggregate(aggregationPipeline);

        return results.length
            ? res.json(results) //om inga error eller om resultat hittas
            : res.status(404).json({ message: 'Inga produkter finns med din sökning.' }); //om resultatet är tomt
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

module.exports = router;