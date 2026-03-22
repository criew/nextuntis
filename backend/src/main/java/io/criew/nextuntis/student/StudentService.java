package io.criew.nextuntis.student;

import io.criew.nextuntis.model.StudentRequest;
import io.criew.nextuntis.model.StudentResponse;
import java.util.List;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {

  private final StudentRepository studentRepository;

  public StudentService(StudentRepository studentRepository) {
    this.studentRepository = studentRepository;
  }

  public List<StudentResponse> findAll() {
    return studentRepository.findAll().stream().map(this::toResponse).toList();
  }

  public StudentResponse findById(Long id) {
    return studentRepository
        .findById(id)
        .map(this::toResponse)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
  }

  public StudentResponse create(StudentRequest request) {
    Student student = toEntity(request);
    return toResponse(studentRepository.save(student));
  }

  public StudentResponse update(Long id, StudentRequest request) {
    Student student =
        studentRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
    applyRequest(student, request);
    return toResponse(studentRepository.save(student));
  }

  public void delete(Long id) {
    if (!studentRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
    }
    studentRepository.deleteById(id);
  }

  private Student toEntity(StudentRequest request) {
    Student student = new Student();
    applyRequest(student, request);
    return student;
  }

  private void applyRequest(Student student, StudentRequest request) {
    student.setFirstName(request.getFirstName());
    student.setLastName(request.getLastName());
    student.setDateOfBirth(request.getDateOfBirth());
    student.setGradeLevel(request.getGradeLevel());
    JsonNullable<String> email = request.getEmail();
    if (email != null && email.isPresent()) {
      student.setEmail(email.get());
    } else if (email != null) {
      student.setEmail(null);
    }
  }

  private StudentResponse toResponse(Student student) {
    StudentResponse response = new StudentResponse();
    response.setId(student.getId());
    response.setFirstName(student.getFirstName());
    response.setLastName(student.getLastName());
    response.setDateOfBirth(student.getDateOfBirth());
    response.setGradeLevel(student.getGradeLevel());
    response.setEmail(JsonNullable.of(student.getEmail()));
    return response;
  }
}
