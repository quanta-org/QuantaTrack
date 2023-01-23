# Pull node base image
FROM node:19-buster-slim

# Install oracle
WORKDIR /tmp
RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1 wget
RUN wget https://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient19.3-basiclite-19.3.0.0.0-1.x86_64.rpm
RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.3*.rpm && apt-get -y autoremove && apt-get -y clean


# Install node dependencies
WORKDIR /svelte
COPY ./package.json .
RUN npm install

# Set perms
# RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

# Move to container
COPY . .

# Launch app
CMD ["npm", "run", "dev"]
EXPOSE 5173