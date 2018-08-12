let router = require('express').Router();
let middlewares = require('../middlewares');
const ObjectId = require('mongoose').Schema.Types.ObjectId;

let Complaints = require('../models/complaints');

router.use(middlewares.authentictionMiddleware);

router.get('/complaints', middlewares.authrisationMiddleware(['agent', 'customer']), (req, res, next)  => {
    const query = res.locals.user.userType == 'customer' ? {createdBy: res.locals.user._id}: {};
    Complaints.find(query, (err, docs) => {
        if(err) return res.status(500).json({'message': err});
        res.json(docs);
    })
});

router.get('/complaints/:id', middlewares.authrisationMiddleware(['agent', 'customer']), (req, res, next) => {
    const query = {
        _id: req.params.id
    };

    Complaints.findOne(query)
    .populate('Users')
    .exec((err, doc) => {
        if(err) return res.status(500).json({message: err});
        if(doc && (res.locals.user.userType == 'agent' || doc.toJSON().createdBy.toString() == res.locals.user._id))
            res.json(doc);
        else
            res.status(404).json({message: 'complaint not found'});
    })
})

router.post('/complaints',middlewares.authrisationMiddleware(['customer']), (req, res, next) => {
    const complaint = new Complaints({
        createdBy: res.locals.user._id,
        title: req.body.title,
        discription: req.body.discription,
        comments: [],
        status: 'added'
    });
    complaint.save((err, doc) => {
        if(err) return res.status(500).json({message: err});
        res.json({message: 'Complaint crete success'});
    })
});

router.post('/complaints/:id/comment', middlewares.authrisationMiddleware(['customer', 'agent']), (req, res, next) => {
    const comment = {
        commentedBy: res.locals.user._id,
        comment: req.body.comment
    }
    Complaints.findOneAndUpdate({
        _id: req.params.id
    }, { $push: {comments: comment}}, (err, doc) => {
        if(err) return res.status(500).json({message: err});
        res.json({message: 'comment added success'});
    });
})

module.exports = router;