let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4/database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function fetchAllRestaurants(){
  let query="Select * from restaurants";
  let response= await db.all(query, []);
  return { restaurants : response};
}

app.get("/restaurants", async(req, res)=>{
try{  
let results = await fetchAllRestaurants()
if(results.restaurants.length===0){
 return res.status(404).json({message : "No restaurants found"})
}
return res.status(200).json(results)
}
catch(error){
  return res.status(500).json({error : error.message})
}
});

async function fetchRestaurantById(id){
  let query="Select * from restaurants where id =?";
  let response= await db.get(query, [id]);
  return {restaurant : response};
}

app.get("/restaurants/details/:id", async(req, res)=>{
try{  
  let id = parseInt(req.params.id);
  let results = await fetchRestaurantById(id)
  if(results.restaurant===undefined){
    return res.status(404).json({message : "No restaurant found for this id- "+id})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function fetchRestaurantByCuisine(cuisineName){
  let query="Select * from restaurants where cuisine =?";
  let response= await db.all(query, [cuisineName]);
  return {restaurants : response};
}

app.get("/restaurants/cuisine/:cuisineName", async(req, res)=>{
try{  
  let cuisineName = req.params.cuisineName;
  let results = await fetchRestaurantByCuisine(cuisineName)
  if(results.restaurants.length===0){
    return res.status(404).json({message : "No restaurants found for this Cuisine- "+cuisineName})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury){
  let query="Select * from restaurants where isVeg =? AND hasOutdoorSeating=? AND isLuxury=?";
  let response= await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return {restaurants : response};
}

app.get("/restaurants/filter", async(req, res)=>{
try{  
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  let results = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury)
  if(results.restaurants.length===0){
    return res.status(404).json({message : "No restaurants found for this filter- isVeg= "+isVeg+", hasOutdoorSeating= "+hasOutdoorSeating+", isLuxury= "+isLuxury})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function sortRestaurantsByRating(){
  let query="Select * from restaurants order by rating desc";
  let response= await db.all(query, []);
  return {restaurants : response};
}

app.get("/restaurants/sort-by-rating", async(req, res)=>{
try{  
  let results = await sortRestaurantsByRating()
  if(results.restaurants.length===0){
    return res.status(404).json({message : "No restaurants found"})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function filterDishes(isVeg){
  let query="Select * from dishes where isVeg =?";
  let response= await db.all(query, [isVeg]);
  return {dishes : response};
}

app.get("/dishes/filter", async(req, res)=>{
try{  
  let isVeg = req.query.isVeg;
  
  let results = await filterDishes(isVeg)
  if(results.dishes.length===0){
    return res.status(404).json({message : "No dishes found for this filter- isVeg= "+isVeg})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function sortDishesByPrice(){
  let query="Select * from dishes order by price";
  let response= await db.all(query, []);
  return {dishes : response};
}

app.get("/dishes/sort-by-price", async(req, res)=>{
try{  
  let results = await sortDishesByPrice()
  if(results.dishes.length===0){
    return res.status(404).json({message : "No dishes found"})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});


async function fetchAllDishes(){
  let query="Select * from dishes";
  let response= await db.all(query, []);
  return {dishes:response};
}

app.get("/dishes", async(req, res)=>{
let results = await fetchAllDishes()
try{  
  let results = await fetchAllDishes()
  if(results.dishes.length===0){
    return  res.status(404).json({message : "No dishes found"})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});

async function fetchDishById(id){
  let query="Select * from dishes where id =?";
  let response= await db.get(query, [id]);
  return {dish : response};
}

app.get("/dishes/details/:id", async(req, res)=>{
try{  
  let id = parseInt(req.params.id);
  let results = await fetchDishById(id)
  if(results.dish===undefined){
    return res.status(404).json({message : "No dish found for this id- "+id})
  }
  return res.status(200).json(results)
  }
  catch(error){
    return res.status(500).json({error : error.message})
  }
});
