class Response {
    success(res, message, data = null) {
      return res.status(200).json({
        state: true,
        message,
        innerData: data,
      });
    }
  
    created(res, message, data = null) {
      return res.status(201).json({
        state: true,
        message,
        innerData: data,
      });
    }
  
    error(res, message, innerData = null) {
      return res.status(400).json({
        state: false,
        message,
        innerData,
      });
    }
  
    notFound(res, message) {
      return res.status(404).json({
        state: false,
        message,
        innerData: null,
      });
    }
  
    serverError(res, message) {
      return res.status(500).json({
        state: false,
        message,
        innerData: null,
      });
    }
  }
  
  module.exports = new Response();