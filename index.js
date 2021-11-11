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

const getalltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};

const addtours = (req, res) => {
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
};

const updatetour = async (req, res) => {
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
};

const deletetour = (req, res) => {
  const tourindex = tours.findIndex(({ id }) => id === req.params.id * 1);

  const deletedtour = tours.splice(tourindex, 1);

  if (tourindex == -1) {
    return res.status(404).json({
      status: 'fail',
      data: 'invalid',
    });
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-sample.json`,
    JSON.stringify(tours),
    (err) => {
      return res.status(201).json({
        status: 'success',
        data: null,
      });
    }
  );
};
const gettour = (req, res) => {
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
};

app.route('/api/v1/tours').get(getalltours).post(addtours);
app
  .route('/api/v1/tours/:id')
  .get(gettour)
  .patch(updatetour)
  .delete(deletetour);

const port = '8000';

app.listen(port, () => {
  console.log(`Server listening to port ${port}...`);
});
