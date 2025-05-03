'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    class: '',
    contact: '',
    address: '',
  });

  const [students, setStudents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Fetch all students
  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/student');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Form field change handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.grade.trim()) newErrors.grade = 'Grade is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact number must be 10 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add or update student
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(`/api/student/${editingId}`, formData);
      } else {
        await axios.post('/api/student', formData);
      }
      fetchStudents();
      handleReset();
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      name: student.name,
      grade: student.grade,
      class: student.class,
      contact: student.contact,
      address: student.address,
    });
    setEditingId(student._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`/api/student/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      grade: '',
      class: '',
      contact: '',
      address: '',
    });
    setEditingId(null);
    setErrors({});
  };

  // The styled return UI
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-indigo-800 drop-shadow-md">
          📚 Student Management Dashboard
        </h1>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
            {editingId ? '✏️ Edit Student' : '➕ Add New Student'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {['name', 'grade', 'contact', 'class'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="text-sm font-medium text-gray-700 mb-2 block capitalize">
                    {field}*
                  </label>
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                      errors[field] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-300'
                    }`}
                    placeholder={`Enter ${field}`}
                  />
                  {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                Address*
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-300'
                }`}
                placeholder="Enter address"
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition"
              >
                {isLoading ? 'Processing...' : editingId ? 'Update Student' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Student List Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">📋 Students List</h2>
          {isLoading && !students.length ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
              <p className="text-gray-500">No students found. Add a new student above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-indigo-50">
                  <tr>
                    {['Name', 'Grade', 'Class', 'Contact', 'Address', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left font-semibold text-indigo-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-indigo-50">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.grade}</td>
                      <td className="px-4 py-3">{student.class}</td>
                      <td className="px-4 py-3">{student.contact}</td>
                      <td className="px-4 py-3">{student.address}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        Student Management Dashboard © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
