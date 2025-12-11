region        = "us-east-1"
instance_type = "t2.micro"
key_name      = "hospital-key"
docker_image  = "aksah22/hospital-app:latest"

# IMPORTANT — USE YOUR REAL MONGODB URL
mongodb_uri = "mongodb+srv://hospital@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority"

session_secret = "mysecretkey"
