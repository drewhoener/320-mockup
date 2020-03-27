import { Router } from 'express';
import authRouter from '../middleware/authrouter';
import Company from '../database/schema/companyschema';
import { authMiddleware } from '../middleware/authtoken';
import Employee from '../database/schema/employeeschema';
import { ObjectId } from 'mongodb';

const apiRouter = Router();

// noinspection JSUnresolvedFunction
apiRouter.use('/auth', authRouter);
// noinspection JSUnresolvedFunction
apiRouter.get('/companies', (req, res) => {
    Company.find({})
        .then(result => {
            const companies = result.map(entry => {
                return {
                    companyId: entry._id,
                    companyName: entry.name
                };
            });
            res.status(200).json({ companies });
        })
        .catch(err => {
            res.status(500).send('Internal Server Error');
        });
});

// noinspection JSUnresolvedFunction
apiRouter.get('/employees', authMiddleware, (req, res) => {
    if (!req.tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }

    Employee.find({ company: new ObjectId(req.tokenData.company), _id: { '$ne': req.tokenData.employeeId } })
        .then(result => {
            // console.log(result);
            if (!result) {
                result = [];
            }
            res.status(200).json({
                employees: result
            });
        })
        .catch(err => {
            res.status(500).send('Internal Error');
        });
});

export default apiRouter;