PS=`docker ps | grep sails | tr -s ' ' ' ' | cut -d' ' -f1`
echo "Starting container: <$PS>"
docker exec -it $PS bash -c "cd frontend && gulp watch"
