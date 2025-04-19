const designSvc = require("./design.service")

class DesignController {

  create = async (req,res,next) => {
    try {
      const data = await designSvc.transformCreateRequest(req)

      const design = await designSvc.createDesign(data)

      res.json({
        data: design,
        message: "Design create successfully",
        status: "DESIGN_CREATED_SUCCESSFULLY",
        options: null
      })
    } catch(exception) {
      console.log("Error storing design: ", exception)
      next(exception)
    }
  }

  index = async (req,res,next) => {
    try {
      let page = +req.query.page || 1;
      let limit = +req.query.limit || 8;
      let skip = (page-1) * limit;

      let filter = {}

      if(req.query.search) {
        filter = {
          $or: [
            {title: new RegExp(req.query.search, 'i')},
            {category: new RegExp(req.query.search, 'i')},
            {description: new RegExp(req.query.search, 'i')}
          ]
        }
      }

      let data = await designSvc.listAllDesign({skip,limit,filter})

      const totalCount = await designSvc.countData(filter)

      res.json({
        detail: data,
        message: "Designs list",
        status: "SUCCESS_LISTING_DESIGNS",
        options: {
          currentPage: page,
          limit: limit,
          totalData: totalCount
        }
      })
    } catch(exception) {
      console.log("Error indexing designs: ", exception)
      next(exception)
    }
  }

  detail = async (req,res,next) => {
    try {
      const id = req.params.id
      const data = await designSvc.getSingleDesignByFilter({
        _id: id
      })

      res.json({
        detail: data,
        message: "Design fetched successfully",
        status: "DESIGN_FETCHED",
        options: null
      })
    } catch(exception) {
      console.log("Error fetching design detail: ", exception)
      next(exception)
    }
  }

  update = async (req,res,next) => {
    try {
      const id = req.params.id
      const data = await designSvc.getSingleDesignByFilter({
        _id: id
      })
      const updatedData = await designSvc.transformUpdateRequest(req,data)
      const response = await designSvc.updateDesignByFilter({
        _id: id
      }, updatedData)

      res.json({
        detail: response,
        message: "Design updated successfully",
        status: "DESIGN_UPDATED_SUCCESSFULLY",
        options: null
      })
    } catch(exception) {
      console.log("Error updating design: ", exception)
      next(exception)
    }
  }

  delete = async (req,res,next) => {
    try {
      const id = req.params.id
      const design = await designSvc.getSingleDesignByFilter({
        _id: id
      })
      
      if(!design) {
        throw{code: 404, message: "Design does not exist", status: "DESIGN_NOT_FOUND"}
      }

      const response = await designSvc.deleteSingleDesignByFilter({
        _id: id
      })

      res.json({
        detail: response,
        message: "Design deleted successfully",
        status: "DESIGN_DELETED_SUCCESSFULLY",
        options: null
      })
    } catch(exception) {
      console.log("Error deleting design: ", exception)
      next(exception)
    }
  }
 
  getForHome = async (req,res,next) => {
    try {
      const data = await designSvc.listAllDesign({
        skip: 0,
        limit: 8,
      })

      res.json({
        detail: data,
        message: "Get design for home",
        status: "GET_FOR_HOME"
      })
    } catch(exception) {
      console.log("Error getting for home: ", exception)
      next(exception)
    }
  }

  getDesignBySlug = async (req,res,next) => {
    try {
      const slug = req.params.slug
      const data = await designSvc.getSingleDesignByFilter({
        slug: slug
      })

      const relatedDesigns = await designSvc.listAllDesign({
        skip: 0,
        limit: 8,
        filter: {
          slug: {$ne: slug},
          category: data.category
        }
      })

      res.json({
        detail: {
          designs: data,
          relatedDesigns: relatedDesigns
        },
        message: "Design fetched by slug",
        status: "DESIGN_FETCH_SUCCESSFULLY",
        options: null
      })
    } catch(exception) {
      console.log("Error getting design by slug: ", exception)
      next(exception)
    }
  }

} 

const designCtrl = new DesignController()
module.exports = designCtrl