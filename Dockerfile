FROM ruby:2.7.6

RUN bundle install
# コンテナ内にコピーした Gemfile の bundle install