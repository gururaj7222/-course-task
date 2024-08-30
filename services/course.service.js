const  Course = require('../models/course.model');
const  City = require('../models/city.model');
const  University = require('../models/university.model');
const  Country = require('../models/country.model');
const {Op} =require('sequelize')

const createCourse = async (courseData) => {
  return Course.create(courseData);
};

const getCourses = async (page = 1, limit = 10, search = '', universityId, cityId, countryId) => {
  const offset = (page - 1) * limit;

  const where = {
    ...(search && { courseName: { [Op.iLike]: `%${search}%` } }),
    ...(universityId && { universityId }),
    ...(cityId && { cityId }),
    ...(countryId && { countryId })
  };

  try {
    const { count, rows } = await Course.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: University, as: 'University' },
        { model: City, as: 'City' },
        { model: Country, as: 'Country' }
      ]
    });

    return {
      data:courseData,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      courses: rows
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}
const getCourseById = async (id) => {
  return Course.findByPk(id, {
    include: ['University', 'City', 'Country']
  });
};

const updateCourse= async (courseId, updateData) => {
  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    await course.update(updateData);

    return course;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

const deleteCourse = async (Id) => {
  try {
    const course = await Course.findByPk(Id);

    if (!course) {
      throw new Error('Course not found');
    }

    await course.destroy();

    return course;  
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};


module.exports = {
  getCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse
};
