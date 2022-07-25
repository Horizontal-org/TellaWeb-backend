pipeline {
    agent any
    
    stages {
      stage ('Build docker image') {
        steps {
          script {
            echo "Bulding docker images"
            docker.build("horizontalorg/tellaweb-api:latest")
          }
        }
      }
      stage ('Push docker image') {
        steps {
          script {
            echo "Pushing the image to docker hub"
            def localImage = "horizontalorg/tellaweb-api:latest"
          
            def repositoryName = "horizontalorg/${localImage}"
          
            // Create a tag that going to push into DockerHub
            // sh "docker tag ${localImage} ${repositoryName} "
            
            docker.withRegistry("", "DockerHubCredentials") {
              def image = docker.image("${repositoryName}");
              image.push()
            }

          }
        }
      }
    }
}