# #Docker Hubからruby:3.0.5のイメージをプルする
FROM ruby:2.7.6

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY . /myappf
CMD date +"%Y-%m-%d %H:%M:%S ( UTC )"


# #debian系のためapt-getを使用してnode.jsとyarnをインストール
# RUN apt-get update -qq
# RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \ && apt-get install -y nodejs
# RUN npm install --global yarn

# #docker内の作業ディレクトリを作成＆設定
# WORKDIR /docker_rails_test

# #Gemfile,Gemfile.lockをローカルからCOPY
# COPY Gemfile Gemfile.lock /docker_rails_test/

# #コンテナ内にコピーしたGemfileを用いてbundel install
# RUN bundle install

# #railsを起動する
# CMD ["rails", "server", "-b", "0.0.0.0"]



# ----------------------------
# 学習用
# FROM ubuntu:20.04

# RUN apt update
# RUN apt install -y vim

# COPY Gemfile Gemfile.lock /docker_rails_test/

# CMD date +"%Y-%m-%d %H:%M:%S ( UTC )"
