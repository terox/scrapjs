/**
 * Iterate in a table element
 *
 * @param  {object} model   Model
 * @param  {object} context Context
 * @return {array}         [description]
 */
module.exports = function(model, $$) {

    var that = this, result, otop, obottom;

    otop    = model.offset_top;
    obottom = model.offset_bottom;

    // Iterate over all table rows
    result = context.find('tbody tr').map(function(i) {

        //if(model.offset_row-- != 0) return;
        var cols = {};
        for (colName in model.columns) {
            cols[colName] = that.pipe(model.columns[colName], this);
        }

        return cols;
    });

    return result;
}