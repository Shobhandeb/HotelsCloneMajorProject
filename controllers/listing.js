const Listing = require("../models/listing");


module.exports.index = async(req,res)=>{
    const allListings= await Listing.find({})
//    console.log(allListings);
   res.render("listings/index.ejs",{allListings});
};

module.exports.createListing = async(req,res,next)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.flash("success","New listing Created!");
        res.redirect("/listings");
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).
    populate({
        path:"reviews",
        populate:{
         path:"author",
    },
    })
    .populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{listing});
    }    
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exists");
        return res.redirect(`/listings`);
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing ,originalImageUrl});
};
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Get updated listing
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // If a new image was uploaded
    if (req.file) {

        // Save new image
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};




module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted item:",deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}
