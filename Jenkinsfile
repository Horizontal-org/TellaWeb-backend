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
            def localImage = "tellaweb-api:latest"
          
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

      stage ('Deploy to staging') {
        steps{
          sshagent(credentials : ['TellawebBeta']) {
            sh 'ssh -o StrictHostKeyChecking=no root@beta.web.tella-app.org "cd /home/tellaweb-beta ; docker-compose pull api ; docker-compose up -d api"'
          }
        }
      }

      stage ('Clean unneccesary docker images') {
        steps{
            sh "docker rmi $(docker images -q -f dangling=true)"
        }
      }
    }
}