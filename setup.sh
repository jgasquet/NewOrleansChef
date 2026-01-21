#!/bin/bash

# NewOrleansChef App Setup Script

echo "🍴 Setting up NewOrleansChef App..."

# Create directory structure
mkdir -p public/{css,js,images,fonts}
mkdir -p src/{components,data,utils}
mkdir -p server/{routes,models,controllers}

echo "✅ Directory structure created"
echo "📁 Project structure:"
echo "neworleanschef/"
echo "├── public/          # Static assets"
echo "│   ├── css/        # Stylesheets"
echo "│   ├── js/         # Client-side JavaScript"
echo "│   ├── images/     # Images and icons"
echo "│   └── fonts/      # Custom fonts"
echo "├── src/            # Source code"
echo "│   ├── components/ # Reusable components"
echo "│   ├── data/       # Static data files"
echo "│   └── utils/      # Utility functions"
echo "├── server/         # Backend code"
echo "│   ├── routes/     # API routes"
echo "│   ├── models/     # Data models"
echo "│   └── controllers/# Business logic"
echo "└── index.html      # Main HTML file"

echo ""
echo "🚀 Next steps:"
echo "1. Move your HTML to index.html"
echo "2. Extract CSS to public/css/styles.css"
echo "3. Extract JS to public/js/main.js"
echo "4. Add restaurant data to src/data/restaurants.json"
echo "5. Set up backend with Node.js/Express"
