const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Categories = require('../models/Categories');
const { ObjectId } = require('mongoose').Types;

router.get('/', async (req, res) => {
    try {
        const { name, category, categoryName, price, ratingSort } = req.query; // Lägger till querys för API url. Se README.txt för tutorial

        const aggregationPipeline = [];
        const matchStage = {};

        // Skapar en averageRating baserad på alla reviews för produkten
        // if (averageRating === 'true') {
            aggregationPipeline.push(
                { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        category: { $first: "$category" },
                        averageRating: { 
                            $avg: { 
                                $ifNull: ["$ratings.rating", 0]
                            }
                        },
                        price: { $first: "$price" },
                        stock: { $first: "$stock" },
                        images: { $first: "$images" },
                        ratings: { 
                            $push: { 
                                user_id: "$ratings.user_id",
                                rating: "$ratings.rating",
                                review: "$ratings.review"
                            }
                        }
                    }
                }
            );
        // }

        // Hanterar category query function
        if (category) {
            if (ObjectId.isValid(category)) { //Om vi använder "ObjectId" i queryn
                matchStage.category = ObjectId(category);
            } 
            else {
                    return res.status(404).json({ message: 'Category not found' });
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
                averageRating: 1,
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