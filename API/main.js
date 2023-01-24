//Import express
const express = require('express');
const app = express();
const port = 3000
//Import cors
const cors = require('cors');
app.use(cors());

//Cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());


//Serveur express sur le port 3000
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}!`)
    console.log('http://localhost:3000')
}
);
//Connexion à la base de données
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gautier',
    database: 'apirest'
});




//Token
const jwt = require('jsonwebtoken');
const secret = 'secret';

//Import body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

/////////////////////
//      USER       //
/////////////////////

//Route register avec génération du token
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const adresse = req.body.adresse;
    const city = req.body.city;
    const postalCode = req.body.postalCode;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "INSERT INTO users (username, password, email, adresse, city, postalCode) VALUES (?,?,?,?,?,?)",
            [username, hash, email, adresse, city, postalCode],
            (err, result) => {
                if (err) {
                    res.send({ err: err });
                }
            }
        );
    });
});

//Route login avec génération du token
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const adresse = req.body.adresse;
    const city = req.body.city;
    const postalCode = req.body.postalCode;
    db.query( //Requête pour récupérer l'utilisateur
        "SELECT * FROM users WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        const id = result[0].id;
                        const username = result[0].username;
                        const password = result[0].password;
                        const email = result[0].email;
                        const adresse = result[0].adresse;
                        const city = result[0].city;
                        const postalCode = result[0].postalCode;


                        const token = jwt.sign({ id, username, password, email, adresse, city, postalCode }, secret, {
                            expiresIn: "3h"
                        });
                        res.cookie('token', token, { httpOnly: true });
                        res.status(200).json({ auth: true, token: token, result: result });
                    } else {
                        res.status(403).json({ message: "Mot de passe incorrect" });
                    }
                });
            } else {
                res.status(403).json({ message: "Utilisateur non trouvé" });
            }
        }
    );
});

// Afficher l'information de l'utilisateur connecté avec le token
app.get('/me', (req, res) => {
    const decoded = jwt.verify(req.headers.authorization, secret);
    res.json({
        id: decoded.id,
        username: decoded.username,
        password: decoded.password,
        email: decoded.email,
        adresse: decoded.adresse,
        city: decoded.city,
        postalCode: decoded.postalCode,
        role_id: decoded.role_id
    });
}
);


// Modifier user (user) par son ID et mettre à jour le token
app.put('/user/update/:id', (req, res) => {
    const id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const adresse = req.body.adresse;
    const city = req.body.city;
    const postalCode = req.body.postalCode;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "UPDATE users SET username = ?, password = ?, email = ?, adresse = ?, city = ?, postalCode = ? WHERE id = ?",
            [username, hash, email, adresse, city, postalCode, id],
            (err, result) => {
                if (err) {
                    res.send({ err: err });
                }
                const token = jwt.sign({ id, username, password, email, adresse, city, postalCode }, secret, {
                    expiresIn: "3h"
                });
                res.cookie('token', token, { httpOnly: true });
                res.status(200).json({ auth: true, token: token, result: result });
            }
        );
    });
});

//Route pour ajouter un article (user )
app.post('/product/add', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const vendeur = req.body.vendeur;
    const currency = req.body.currency;
    db.query(
        "INSERT INTO products (name, description, price, vendeur, currency) VALUES (?,?,?,?,?)",
        [name, description, price, vendeur, currency],
        (err, result) => {
            if (err) {
                console.log(err);
            }
        }
    );
});

//Route pour afficher les produits d'un utilisateur (user)
app.get('/products/user/:vendeur', (req, res) => {
    const vendeur = req.body.vendeur;
    db.query(
        "SELECT * FROM products WHERE vendeur = ?",
        vendeur,
        (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(result);
        }
    );
});



//Ajouter image (user)
app.post('/file', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded.' });
            return;
        }
        console.log(req.file.path);
        res.status(200).json({ message: "Image ajoutée" });
    });
});







//Route logout
app.get('/logout', (req, res) => {
    //Supprimer le localStorage
    localStorage.removeItem('token');
    res.status(200).json({ message: "Vous êtes déconnecté" });
});




/////////////////////
//      ADMIN      //
/////////////////////

//Récupérer tous les users (admin)
app.get('/users', (req, res) => {
    db.query(
        "SELECT * FROM users",
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Utilisateur incorrect" });
            }
        }
    );
}
);

//Ajouter un user (admin)
app.post('/users/add', (req, res) => {
    //Lire le ng-model du formulaire
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const adresse = req.body.adresse;
    const city = req.body.city;
    const postalCode = req.body.postalCode;

    //Vérifier si l'utilisateur existe déjà
    db.query(
        "SELECT * FROM users WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(403).json({ message: "Utilisateur déjà existant" });
            } else {
                //Si l'utilisateur n'existe pas, on l'ajoute
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    db.query(
                        "INSERT INTO users (username, password, email, adresse, city, postalCode) VALUES (?,?,?,?,?,?)",
                        [req.body.username, hash, req.body.email, req.body.adresse, req.body.city, req.body.postalCode],
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.status(201);
                            }
                        }
                    );
                }
                );
            }
        }
    );
}
);



//Modifier un user (admin)
app.put('/users/:id', (req, res) => {
    db.query(
        "UPDATE users SET username = ?, password = ? WHERE id = ?",
        [req.body.username, req.body.password, req.params.id],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Utilisateur incorrect" });
            }
        }
    );
}
);
//Modifier un user avec son id (admin)
app.put('/users/update/:id', (req, res) => {
    const id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const adresse = req.body.adresse;
    const city = req.body.city;
    const postalCode = req.body.postalCode;
    db.query(
        "UPDATE users SET username = ?, password = ?, email = ?, adresse = ?, city = ?, postalCode = ? WHERE id = ?",
        [username, password, email, adresse, city, postalCode, id],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Utilisateur incorrect" });
            }
        }
    );
}
);


//Supprimer un user avec son id (admin)
app.delete('/users/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query(
        "DELETE FROM users WHERE id = ?",
        id,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Utilisateur incorrect" });
            }
        }
    );
});



/////////////////////
//     PRODUCTS    //   
/////////////////////

//Créer un produit
app.post('/products/add', (req, res) => {
    db.query(
        "INSERT INTO products (name, description, price, currency, vendeur) VALUES (?,?,?,?)",
        [req.body.name, req.body.description, req.body.price, req.body.currency],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            if (result.length > 0) {
                res.status(200).json(result);
                console.log("produit ajouté");
            }
        }
    );
}
);

//supprime un produit
app.delete('/products/delete/:id', (req, res) => {
    db.query(
        "DELETE FROM products WHERE id = ?",
        req.params.id,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Produits incorrect" });
            }
        }
    );
}
);

//modifie un produit
app.put('/products/edit/:id', (req, res) => {
    db.query(
        "UPDATE products SET name = ?, description = ?, price = ?, image = ?, currency = ? WHERE id = ?",
        [req.body.name, req.body.description, req.body.price, req.body.image, req.body.currency, req.params.id],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Produits incorrect" });
            }
        }
    );
}
);

//récupère tous les produits existants
app.get('/products', (req, res) => {
    db.query(
        "SELECT * FROM products",
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(403).json({ message: "Produits incorrect" });
            }
        }
    );
}
);
