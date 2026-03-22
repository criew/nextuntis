package io.criew.nextuntis.student;

import io.criew.nextuntis.api.StudentsApi;
import io.criew.nextuntis.model.StudentRequest;
import io.criew.nextuntis.model.StudentResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentController implements StudentsApi {

  private final StudentService studentService;

  public StudentController(StudentService studentService) {
    this.studentService = studentService;
  }

  @Override
  public ResponseEntity<List<StudentResponse>> listStudents() {
    return ResponseEntity.ok(studentService.findAll());
  }

  @Override
  public ResponseEntity<StudentResponse> createStudent(StudentRequest studentRequest) {
    return ResponseEntity.status(HttpStatus.CREATED).body(studentService.create(studentRequest));
  }

  @Override
  public ResponseEntity<StudentResponse> getStudent(Long id) {
    return ResponseEntity.ok(studentService.findById(id));
  }

  @Override
  public ResponseEntity<StudentResponse> updateStudent(Long id, StudentRequest studentRequest) {
    return ResponseEntity.ok(studentService.update(id, studentRequest));
  }

  @Override
  public ResponseEntity<Void> deleteStudent(Long id) {
    studentService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
