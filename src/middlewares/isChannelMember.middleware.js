const Channel = require('../models/channel.models.js');
const {response_403, response_404, response_500} = require('../utils/responseCodes.utils.js');

exports.isChannelMember = async (req, res, next) => {
    try {
        const userId = req.body.user._id;
        const channelId = req.params.id;
        const channel = await Channel.findById(channelId).populate('workspace');
        if(!channel) {
            return response_404(res, 'Channel not found');
        }      
        const user = channel.members.find(member => member._id.equals(userId));
        if(!user || !channel.workspace.createdBy.equals(userId)) {
            return response_403(res, 'You are not authorized to perform this action');
        }
        req.channel = channel;
        req.workspace = channel.workspace;
        next();
    } catch (error) {
        return response_500(res, 'Internal Server error', error);
    }
}