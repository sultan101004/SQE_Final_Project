pipeline {
  agent any

  options { timestamps() }

  environment {
    REGISTRY_URL = "docker.io/sultan101004"
    IMAGE_TAG    = "latest"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Backend Tests (Jest)') {
      steps {
        sh '''
          cd backend
          npm ci
          npm test
        '''
      }
    }

    stage('Frontend Build & Cypress Smoke') {
      steps {
        sh '''
          cd frontend
          npm ci
          npm run build
          npm run cy:run
        '''
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'REGISTRY_CREDS', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
          sh '''
            echo "$REG_PASS" | docker login $REGISTRY_URL -u "$REG_USER" --password-stdin
          '''
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
        sh '''
          TAG="${IMAGE_TAG}"
          docker build -t $REGISTRY_URL/conduit-backend:$TAG backend
          docker push $REGISTRY_URL/conduit-backend:$TAG

          docker build -t $REGISTRY_URL/conduit-frontend:$TAG frontend
          docker push $REGISTRY_URL/conduit-frontend:$TAG
        '''
      }
    }
  }
}

