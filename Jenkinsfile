pipeline {
  environment {
    imagename = "gmarcos87/tellaweb-backend"
    registryCredential = '65174897-5c07-4754-a198-ed4727630055'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git([url: 'https://github.com/Horizontal-org/tellaweb-nestjs.git', branch: env.BRANCH_NAME, credentialsId: '65174897-5c07-4754-a198-ed4727630055'])
 
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build imagename
        }
      }
    }

    stage('Publish Image') {
      when {
          expression { } 
      }
      input message: "Publish image?"
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push("$BUILD_NUMBER")
             dockerImage.push('latest')
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $imagename:$BUILD_NUMBER"
         sh "docker rmi $imagename:latest"
 
      }
    }
  }
}