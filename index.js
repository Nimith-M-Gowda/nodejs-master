const express = require('express');
const fs = require('fs');

const app = new express();
app.use(express.json());
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-sample.json`)
);

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natour' });
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-sample.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        tours: newTour,
      });
    }
  );
});

app.get('/api/v1/tours/:id', (req, res) => {
  const newid = req.params.id * 1;
  const newtour = tours.find(({ id }) => id === newid);

  if (!newtour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id found',
    });
  }
  return res.status(200).json({
    status: 'success',
    message: newtour,
  });
});

app.patch('/api/v1/tours/:id', async (req, res) => {
  const gettour = tours.find(({ id }) => id === req.params.id * 1);

  const objectIndex = tours.findIndex((obj) => obj.id === req.params.id * 1);

  const updatedtour = { ...gettour, ...req.body };

  if (!updatedtour) {
    return res.status(404).json({
      status: 'fail',
      message: 'not found, invalid id',
    });
  }

  tours[objectIndex] = updatedtour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-sample.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(200).json({
        status: 'success',
        tour: updatedtour,
      });
    }
  );
});

const port = '8000';

app.listen(port, () => {
  console.log(`Server listening to port ${port}...`);
});
