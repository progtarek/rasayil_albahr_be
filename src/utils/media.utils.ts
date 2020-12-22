/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Allow only images
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const fileNameGenerator = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${uuidv4()}${fileExtName}`);
};
