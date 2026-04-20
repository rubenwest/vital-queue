import { TestBed } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { TriageLevel } from '../models/patient.model';

describe('QueueService', () => {
  let service: QueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [QueueService] });
    service = TestBed.inject(QueueService);
  });

  describe('addPatient', () => {
    it('adds a patient with waiting status and a generated id', () => {
      // Arrange
      const form = { name: 'Alice', age: 30, chiefComplaint: 'Chest pain', triageLevel: TriageLevel.Immediate };

      // Act
      service.addPatient(form);

      // Assert
      const patients = service.allPatients();
      expect(patients).toHaveLength(1);
      expect(patients[0].status).toBe('waiting');
      expect(patients[0].id).toBeTruthy();
    });
  });

  describe('sortedQueue', () => {
    it('sorts by triage level ascending, then by arrival time ascending', () => {
      // Arrange — add in reverse priority order
      service.addPatient({ name: 'C', age: 40, chiefComplaint: 'Cough', triageLevel: TriageLevel.NonUrgent });
      service.addPatient({ name: 'B', age: 35, chiefComplaint: 'Fracture', triageLevel: TriageLevel.Urgent });
      service.addPatient({ name: 'A', age: 25, chiefComplaint: 'Anaphylaxis', triageLevel: TriageLevel.Immediate });

      // Act
      const queue = service.sortedQueue();

      // Assert
      expect(queue.map((p) => p.name)).toEqual(['A', 'B', 'C']);
    });

    it('breaks triage ties by arrival time', () => {
      // Arrange
      service.addPatient({ name: 'First', age: 20, chiefComplaint: 'x', triageLevel: TriageLevel.Urgent });
      service.addPatient({ name: 'Second', age: 21, chiefComplaint: 'y', triageLevel: TriageLevel.Urgent });

      // Act & Assert
      const queue = service.sortedQueue();
      expect(queue[0].name).toBe('First');
      expect(queue[1].name).toBe('Second');
    });

    it('excludes admitted and discharged patients', () => {
      // Arrange
      service.addPatient({ name: 'Admitted', age: 50, chiefComplaint: 'a', triageLevel: TriageLevel.Standard });
      service.addPatient({ name: 'Discharged', age: 55, chiefComplaint: 'b', triageLevel: TriageLevel.NonUrgent });
      service.addPatient({ name: 'Waiting', age: 30, chiefComplaint: 'c', triageLevel: TriageLevel.Urgent });

      const [admitted, discharged] = service.allPatients();
      service.admit(admitted.id);
      service.discharge(discharged.id);

      // Act & Assert
      expect(service.sortedQueue()).toHaveLength(1);
      expect(service.sortedQueue()[0].name).toBe('Waiting');
    });
  });

  describe('updateTriageLevel', () => {
    it('re-sorts the queue immediately after triage change', () => {
      // Arrange
      service.addPatient({ name: 'Low', age: 30, chiefComplaint: 'x', triageLevel: TriageLevel.Standard });
      service.addPatient({ name: 'High', age: 31, chiefComplaint: 'y', triageLevel: TriageLevel.NonUrgent });

      const lowId = service.allPatients()[0].id;

      // Act — demote Low to NonUrgent (5), promote High to Immediate (1)
      service.updateTriageLevel(lowId, TriageLevel.NonUrgent);
      const highId = service.allPatients()[1].id;
      service.updateTriageLevel(highId, TriageLevel.Immediate);

      // Assert
      expect(service.sortedQueue()[0].name).toBe('High');
    });
  });

  describe('admit / discharge', () => {
    it('removes admitted patient from the active queue', () => {
      // Arrange
      service.addPatient({ name: 'Patient', age: 40, chiefComplaint: 'z', triageLevel: TriageLevel.Urgent });
      const id = service.allPatients()[0].id;

      // Act
      service.admit(id);

      // Assert
      expect(service.sortedQueue()).toHaveLength(0);
      expect(service.allPatients()[0].status).toBe('admitted');
    });

    it('removes discharged patient from the active queue', () => {
      // Arrange
      service.addPatient({ name: 'Patient', age: 40, chiefComplaint: 'z', triageLevel: TriageLevel.Urgent });
      const id = service.allPatients()[0].id;

      // Act
      service.discharge(id);

      // Assert
      expect(service.sortedQueue()).toHaveLength(0);
      expect(service.allPatients()[0].status).toBe('discharged');
    });
  });
});
