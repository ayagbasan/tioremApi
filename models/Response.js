var Response = {


    setSuccess: function (successData) {

        var result = new Object();
        result.Data = successData;
        result.IsSuccess = true;
        return result;
    },

    setError: function (errCode, errMsg, customMsg) {

        var result = new Object();

        result.IsSuccess = false;
        result.ErrorCode = errCode;
        if (customMsg)
            result.ErrorMessage = customMsg;
        else
            result.ErrorMessage = null;

        if (errMsg)
            result.ErrorDetail = errMsg;
        else result.ErrorDetail = null;

        return result;
    }
}



module.exports = Response;