const Pet = require("../models/Pet");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/pets";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "pet-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

exports.registerPet = [
  upload.single("image"),
  async (req, res) => {
    try {
      const petData = {
        name: req.body.name,
        species: req.body.species,
        breed: req.body.breed,
        age: req.body.age,
        weight: req.body.weight,
        gender: req.body.gender,
        color: req.body.color,
        microchipNumber: req.body.microchipNumber,
        allergies: req.body.allergies,
        medicalConditions: req.body.medicalConditions,
        dietaryRequirements: req.body.dietaryRequirements,
        vetName: req.body.vetName,
        vetPhone: req.body.vetPhone,
        ownerName: req.body.ownerName,
      };

      if (req.body.birthDate) {
        petData.birthDate = new Date(req.body.birthDate);
      }

      if (req.file) {
        petData.image = req.file.path.replace(/\\/g, "/");
      }

      const pet = new Pet(petData);
      await pet.save();

      res.status(201).json(pet);
    } catch (error) {
      console.error("Error registering pet:", error);
      res.status(500).json({ error: "Failed to register pet" });
    }
  },
];

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Failed to fetch pets" });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ error: "Failed to fetch pet" });
  }
};

exports.updatePet = [
  upload.single("image"),
  async (req, res) => {
    try {
      const pet = await Pet.findById(req.params.id);

      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      pet.name = req.body.name || pet.name;
      pet.species = req.body.species || pet.species;
      pet.breed = req.body.breed || pet.breed;
      pet.age = req.body.age || pet.age;
      pet.weight = req.body.weight || pet.weight;
      pet.gender = req.body.gender || pet.gender;
      pet.color = req.body.color || pet.color;
      pet.microchipNumber = req.body.microchipNumber || pet.microchipNumber;
      pet.allergies = req.body.allergies || pet.allergies;
      pet.medicalConditions =
        req.body.medicalConditions || pet.medicalConditions;
      pet.dietaryRequirements =
        req.body.dietaryRequirements || pet.dietaryRequirements;
      pet.vetName = req.body.vetName || pet.vetName;
      pet.vetPhone = req.body.vetPhone || pet.vetPhone;
      pet.ownerName = req.body.ownerName || pet.ownerName;

      if (req.body.birthDate) {
        pet.birthDate = new Date(req.body.birthDate);
      }

      if (req.file) {
        if (pet.image) {
          try {
            fs.unlinkSync(pet.image);
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }

        pet.image = req.file.path.replace(/\\/g, "/");
      }

      await pet.save();
      res.json(pet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Failed to update pet" });
    }
  },
];

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    if (pet.image) {
      try {
        fs.unlinkSync(pet.image);
      } catch (err) {
        console.error("Failed to delete pet image:", err);
      }
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Failed to delete pet" });
  }
};
