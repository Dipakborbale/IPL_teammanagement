const express = require('express');
const router = express.Router();
const myuser = require('../model/user_model');
const upload = require('../views/multerConfig');
const passport = require('passport');
const User = require('../model/user_auth');
const fs = require('fs');

// Set up multer storage and file size limit

// Handle file upload
router.post('/add', upload.single('image'), async (req, res) => {
    const newUser = new myuser({
        name: req.body.name,
        Country: req.body.Country,
        Age: req.body.Age,
        Role: req.body.Role,
        teamName: req.body.teamName, // Assign the selected team name to the player
        image: req.file ? req.file.filename : ''
    });

    if (req.file.size > 1024 * 1024* 1.2 ) {
        return res.status(400).send('File size exceeds the limit (1MB).');
    }

    try {
        const savedUser = await newUser.save();
        
        // Redirect to the team management page for the selected team
        res.redirect(`/index`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving user');
    }
});

// Express.js routes
router.get('/home', (req, res) => {
    res.render('home', {authenticated: req.isAuthenticated()}); // Render home.ejs
});

router.get('/index', async (req, res) => {
    try {
        // Retrieve user data from the database
        const users = await myuser.find();
        // Render the index.ejs template with user data
        res.render('index', { mydata: users,  authenticated: req.isAuthenticated()});
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});
// router.get('/add', (req, res) => {
//     res.render('create_form', {authenticated: req.isAuthenticated()});
// });

router.get('/', async (req, res) => {
    try {
        const users = await myuser.find();
        res.render('index', { mydata: users , authenticated: req.isAuthenticated()});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users');
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        const user = await myuser.findById(req.params.id);
        res.render('update_form', { updatedata: user ,  authenticated: req.isAuthenticated()});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user');
    }
});
// POST route to handle updating user data
router.post('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const user = await myuser.findById(req.params.id);
        
        if (!user) {
            return res.status(404).send("User not found.");
        }

        user.name = req.body.name;
        user.Country = req.body.Country;
        user.Age = req.body.Age;
        user.Role = req.body.Role;
        user.teamName = req.body.teamName;
       

        // Check if a file is uploaded
        if (req.file) {
            // If the user already has an image, delete it
            if (user.image) {
                fs.unlinkSync(`./uploads/${user.image}`);
            }
            // Assign the filename of the uploaded image to the user object
            user.image = req.file.filename;
        }

        // Save the updated user object
        await user.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});



router.get('/delete/:id', async (req, res) => {
    try {
        await myuser.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

// Login route
router.get('/login', (req, res) => {
    // Pass the 'authenticated' variable to the login.ejs file
    res.render('login', { title: 'Login', authenticated: req.isAuthenticated() });
});
 
router.post('/login', passport.authenticate('local'), (req, res) => {
    // If authentication succeeds, redirect to a dashboard or profile page
    res.redirect('/home');
});
 
// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Error logging out.");
        }
        res.redirect('/home');
    });
});
router.post('/register', async (req, res) => {
    try {
        const { username, password, phoneNumber, confirmPassword } = req.body;
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const user = new User({ username, phoneNumber });
        
        // Use passport-local-mongoose register method to register user
        await User.register(user, password);

      

        res.redirect('/login'); // Redirect to login page after registration
    } catch (error) {
        console.error(error);
      
        

        res.redirect('/register'); // Redirect back to registration page if an error occurs
    }
});
 
router.get('/register',(req,res)=>{
    res.render('registration', {title: 'Registration',  authenticated: req.isAuthenticated()})
});
router.get('/team-management', (req, res) => {
    res.render('team_management', { authenticated: req.isAuthenticated() });
});


router.get('/add', async (req, res) => {
    try {
        // Fetch teams data from the database or wherever it's stored
        const teams = [
            { teamName: 'Mumbai Indians' },
            { teamName: 'Chennai Super Kings' },
            { teamName: 'Royal Challengers Bangalore' },
            { teamName: 'Kolkata Knight Riders' },
            { teamName: 'Sunrisers Hyderabad' },
            { teamName: 'Rajasthan Royals' },
            { teamName: 'Delhi Capitals' },
            { teamName: 'Punjab Kings' },
            { teamName: 'Gujarat Titans' }, // New team
            { teamName: 'Lucknow Super Giants' } // New team
        ];

        // Render the create_form.ejs template with the teams array
        res.render('create_form', { teams: teams, authenticated: req.isAuthenticated() });
    } catch (error) {
        console.error('Error fetching teams data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Define a route to handle requests for player details of a specific team
// Route to handle fetching player details for a specific team


// router.get('/team/:teamName/players', async (req, res) => {
//     try {
//         const teamName = req.params.teamName;
//         const players = await User.find({ teamName: teamName }); // Use the correct model name
//         res.render('team_players', { players: players, teamName: teamName, authenticated: req.isAuthenticated() });
//     } catch (error) {
//         console.error('Error fetching player data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.get('/team/:teamName/players', async (req, res) => {
    try {
        const teamName = req.params.teamName;
        let backgroundImage = '';

        switch (teamName) {
            case 'Mumbai Indians':
                backgroundImage = '/uploads/mi_w2.png';
                break;
            case 'Chennai Super Kings':
                backgroundImage = '/uploads/csk_w1.jpg';
                break;
            case 'Royal Challengers Bangalore':
                backgroundImage = '/uploads/royal_challengers_bangalore_background.jpg';
                break;
            case 'Kolkata Knight Riders':
                backgroundImage = '/uploads/kkr_w2.jpg';
                break;
            case 'Sunrisers Hyderabad':
                backgroundImage = '/uploads/sunrisers_hyderabad_background.jpg';
                break;
            case 'Rajasthan Royals':
                backgroundImage = '/uploads/rajasthan_royals_background.jpg';
                break;
            case 'Delhi Capitals':
                backgroundImage = '/uploads/delhi_capitals_background.jpg';
                break;
            case 'Punjab Kings':
                backgroundImage = '/uploads/punjab_kings_background.jpg';
                break;
            default:
                backgroundImage = '/uploads/default_background.jpg';
        }
        
        const players = await myuser.find({ teamName: teamName });

        res.render('team_players', { 
            players: players, 
            teamName: teamName, 
            backgroundImage: backgroundImage,
            authenticated: req.isAuthenticated() 
        });
    } catch (error) {
        console.error('Error fetching player data:', error);
        res.status(500).send('Internal Server Error');
    }
});









module.exports = router;


