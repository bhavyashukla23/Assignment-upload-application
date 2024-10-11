import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(400).send('Access Denied');
    }

    const token = authHeader.split(' ')[1];  // Extracting token after 'Bearer '
    //console.log('Extracted Token:', token);
    
    if (!token) {
        return res.status(400).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();  
    } catch (error) {
        console.log('Invalid Token:', error);
        return res.status(400).send('Invalid Token');
    }
};

export default auth;

