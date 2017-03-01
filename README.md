# quebec-parking-assistant
This is the frontend project for a hackathon by Ingeno

##Deployment
- install heroku cli

		brew install heroku
- login to heroku

		heroku login
- add remote to `.git/config`

		[remote "heroku"]
			url = https://git.heroku.com/hackoflovehelper.git
			fetch = +refs/heads/*:refs/remotes/origin/*

- push to deploy

		git push heroku master