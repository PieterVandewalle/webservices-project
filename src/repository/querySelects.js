const USER_SELECT = {
   id: true,
   username: true,
};

const POST_SELECT = {
   id: true,
   date: true,
   title: true,
   description: true,
   price: true,
   category: true,
   deliveryType: true,
   user: {
       select: USER_SELECT
   },
   city: true,
   images: {
       select: {
        id: true,
        url: true,
        blobName: true
       }
   }
};

const MESSAGE_SELECT = {
    id: true,
    content:true,
    sender: {
        select:{
            id: true,
            username: true
        }
    },
    timestamp: true
}

const CONVERSATION_SELECT = {
    id: true,
    post: {
        select: {
            id: true,
            title: true,
        }
    },
    postReplier:{
        select: USER_SELECT
    },
    postOwner:{
        select: USER_SELECT
    },
    deletedByPostReplier: true,
    deletedByPostOwner: true,
    messages: {
        select: MESSAGE_SELECT
    }
};


module.exports = {
     USER_SELECT, POST_SELECT, CONVERSATION_SELECT, MESSAGE_SELECT
}
